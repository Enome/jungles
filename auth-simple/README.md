# Jungles Auth Simple

Simple authorization middleware. If a req.session.user is in the administrator array the request will get nexted.

```js
app.use('/administrator', require('jungles-auth-simple').init(['geert.pasteels@gmail.com']));     
```

## Warning

This module only does authorization you still need authentication middleware that sets a req.session.user. Jungles Auth Persona is an example of such using Mozilla Persona.
