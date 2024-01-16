import express from 'express'
import * as db from './db.json';
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

export default router;
