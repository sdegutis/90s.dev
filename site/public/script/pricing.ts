const root = document.getElementById('upgrade-container')!

const [err, account] = await fetch('/net/user/info', { credentials: 'include' }).then(r => r.json())

const user = (!err && account?.verified) ? account : null

if (!user) {
  root.innerHTML = `
    <p>Not signed in.</p>
    <p><a target='_blank' href='/os/#sys/apps/account.app.js'>Login</a> first, then come back here to upgrade to Pro.</p>
  `
}
else if (user.pro) {
  root.innerHTML = `
    <p>Signed in as ${user.username}.</p>
    <p>You have a pro account!</p>
  `
}
else {
  root.innerHTML = `
    <p>Signed in as ${user.username}.</p>
    <p><a href='/net/upgrade'>Upgrade to Pro</a></p>
  `
}
