const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const config = require('../config.js');

class AwsS3 {
    client = null;
    constructor() {
        if (!this.client) {
            this.client = new S3Client({
                region: 'us-east-1',
                credentials: {
                    accessKeyId: config.AWS_ACCESS_KEY_ID,
                    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
                }
            });
        }
    }
    async createFileObject(fileName, fileBuffer, prefix) {
        const Key = `${prefix}/${fileName}`;
        try {
            await this.client.send(new PutObjectCommand({
                ACL: "public-read",
                Bucket: config.AWS_BUCKET,
                Key,
                Body: fileBuffer
            }));

            return Key;
        } catch (e) {
            console.error(e)
        }
    }

    async getFileObject(Key) {
        try {
            return await this.client.send(new GetObjectCommand({
                Key,
                Bucket: config.AWS_BUCKET
            }))
        } catch (e) {
            console.error(e)
        }
    }

    async getAllFileObjects() {
        try {
            return await this.client.send(new ListObjectsCommand({
                Bucket: config.AWS_BUCKET
            }))
        } catch (e) {
            console.error(e)
        }
    }

    async deleteFolder(Key) {
        try {
            await this.client.send(new DeleteObjectCommand({
                Bucket: config.AWS_BUCKET,
                Key
            }))
        } catch(e) {
            console.error(e)
        }
    }
}

module.exports = AwsS3;