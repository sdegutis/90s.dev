const root = document.getElementById('upgrade-container')!

const hasLicense = localStorage.getItem('licensekey')

if (hasLicense) {
  root.innerHTML = `
    <p>You have a pro account!</p>
  `
}
else {
  const isDev = location.host.includes('localhost')
  const url = isDev
    ? 'https://buy.stripe.com/test_5kQaEZfAG1ZOfxteSr1oI00'
    : 'https://buy.stripe.com/cNi5kE9LS97z15ReE73ks03'

  root.innerHTML = `
    <p><a href='${url}'>Purchase a license</a></p>
  `
}
