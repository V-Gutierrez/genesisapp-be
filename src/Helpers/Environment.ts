import 'dotenv/config'

const isProduction = process.env.NODE_ENV === 'production'

export default isProduction
