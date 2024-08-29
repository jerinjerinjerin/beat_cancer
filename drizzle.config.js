export default {
    dialect: 'postgresql', // Corrected spelling here
    schema: './src/utils/schema.jsx',
    out:'./drizzle',

    dbCredentials: {
        url: 'postgresql://auth-masterclass_owner:vIZ45ARiTGDU@ep-holy-math-a1puy4es.ap-southeast-1.aws.neon.tech/ai-doctor?sslmode=require',
        connectionString:'postgresql://auth-masterclass_owner:vIZ45ARiTGDU@ep-holy-math-a1puy4es.ap-southeast-1.aws.neon.tech/ai-doctor?sslmode=require',
    }
}
