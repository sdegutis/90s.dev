export const isDev = process.argv[2] === 'dev'
export const oshost = isDev ? 'http://localhost:8080' : 'https://os.90s.dev'
