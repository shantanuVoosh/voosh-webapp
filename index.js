const {BigQuery} = require('@google-cloud/bigquery')
const BigQueryClient = new BigQuery()

process.env.GOOGLE_APPLICATION_CREDENTIALS = './bigqueryreadnodejs.json'

async function queryShakespeare(){
    const getWordsSql = `SELECT word, word_count FROM 
    \`bigquery-public-data.samples.shakespeare\` WHERE
    corpus = @corpus AND word_count >= @min_word_count
    ORDER BY word_count DESC`; 

    const options = {
        query:getWordsSql,
        location:'US',
        params:{corpus:'romeoandjuliet', min_word_count:250},
    };

    const [rows] = await BigQueryClient.query(options)
    console.log('Rows:')
    rows.forEach(row=>console.log(row))
}

queryShakespeare()
