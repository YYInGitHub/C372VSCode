const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // res.send("Hello World!")
    res.send("Hello RP !!")
})

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
