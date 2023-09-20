require('dotenv').config();

const config = {
    AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN:process.env.AWS_SESSION_TOKEN,
    PORT:process.env.PORT,
    AWS_BUCKET:process.env.AWS_BUCKET,
    AWS_RDS_HOST:process.env.AWS_RDS_HOST,
    AWS_RDS_USER:process.env.AWS_RDS_USER,
    AWS_RDS_PASSWORD:process.env.AWS_RDS_PASSWORD,
    AWS_RDS_DB:process.env.AWS_RDS_DB,
}

module.exports = config;