import express from 'express'
import routes from './routes'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});