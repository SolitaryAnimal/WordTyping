const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000


app.use(express.static('src'))

app.get('/api/voice', async (req, res) => {
    try {
        const url = `https://dict.youdao.com/dictvoice?${req.url.split('?')[1]}`;
        const response = await axios.get(url, { responseType: 'stream' });

        // 设置响应头，告诉浏览器文件类型和文件名
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent('downloaded-resource')}`);

        // 将下载的资源通过流传输到客户端
        response.data.pipe(res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static('src/web'));
app.use(express.static('build'));

app.listen(port, () => {
    console.log(`运行在 http://127.0.0.1:${port}`)
})