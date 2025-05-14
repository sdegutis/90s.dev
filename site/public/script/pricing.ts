const root = document.getElementById('upgrade-container')!

const [err, account] = await fetch('/net/user/info', { credentials: 'include' }).then(r => r.json())

const user = (!err && account.verified) ? account : null

console.log(user)

if (!user) {
  root.innerHTML = `Login in the app`
}
else if (user.pro) {
  root.innerHTML = `
    <p>Signed in as ${user.username}.</p>
    <p>Already have pro account!</p>
  `
}
else {
  root.innerHTML = `
    <p>Signed in as ${user.username}.</p>
    <p><a href='/net/upgrade'>Upgrade to Pro</a></p>
  `
}
