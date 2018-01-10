// "express": "^4.16.2"
// "express-session": "^1.15.6"

const express = require('express')
const session = require('express-session')
const app = express()

app.use(session({
    secret: 'koala koala koala',
    resave: false,
    saveUninitialized: true,
}))

app.use((req, res, next) => {
    if (req.session.addHeader) {
        res.set({
            'Expires': 0, // For backward compatibility with HTTP/1.0
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        })
    }
    next()
})

const template = (next) => {
    return (req, res) => {
        res.send(`<body>
            <style>
                body { font-family: sans-serif; }
                a { display: inline-block; padding: 0.4em; border: 3px solid #ddd; }
                div { margin: 1em 0; }
            </style>

            Current: ${req.session.username || "(None)"}

            <div>
                ${req.session.username ? '<a href="/logout">logout</a>' : '<a href="/login">login</a>'}
                ${req.session.addHeader ? '<a href="/remove-header">remove header</a>' : '<a href="/add-header">add header</a>'}
            </div>

            <div><a href="/${next}">go to /${next}</a></div>
        </body>`)
    }
}

app.get('/', template('a'))
app.get('/a', template('b'))
app.get('/b', template('c'))
app.get('/c', template('logout'))

app.get('/add-header', (req, res) => {
    req.session.addHeader = true
    res.redirect(req.header('Referer') || '/')
})

app.get('/remove-header', (req, res) => {
    req.session.addHeader = false
    res.redirect(req.header('Referer') || '/')
})

app.get('/login', (req, res) => {
    req.session.username = 'koala'
    res.redirect('/')
})

app.get('/logout', (req, res) => {
    req.session.username = null
    res.redirect('/')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
