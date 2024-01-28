import express from 'express'
import * as db from './db.json';
import axios from "axios";
const router = express.Router();

const dbData = db.restaurants;

router.get('/restaurants', async (req, res) => {
    try{
        res.json(dbData);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/filterRestaurants', async (req, res) => {
    try{
        const restaurant = dbData.filter((restaurant: any) => restaurant.name.toLowerCase().startsWith(req.query.name?.toString().toLowerCase()));
        if(restaurant){
            res.json(restaurant);
        }
        else{
            res.sendStatus(404);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/restaurants/:id', async (req, res) => {
    try{
        const restaurant = dbData.find((restaurant: any) => restaurant.id === req.params.id);
        if(restaurant){
            res.json(restaurant);
        }
        else{
            res.sendStatus(404);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


router.post('/register', async (req, res) => {
    try{
    axios.post('http://localhost:3001/users', req.body)
        .then((response) => {
            res.status(200).send(response.data);
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

export default router;
