const root = document.getElementById('upgrade-container')!

const [err, account] = await fetch('/net/user/info', { credentials: 'include' }).then(r => r.json())

const user = (!err && account.verified) ? account.username : null

if (!user) {
  root.innerHTML = `<p>Signup</p>`
}
else {
  root.innerHTML = `<p>Signed in as ${user}.</p>`
}
