import express from 'express'
import * as db from './db.json';
import axios from "axios";
const router = express.Router();
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from "./middleware";
dotenv.config();
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

router.get('/filterRestaurants',authenticateToken, async (req, res) => {
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
        .then((response: { data: any; }) => {
            res.status(200).send({
                data: {
                    login: response.data[0].login,
                    mail: response.data[0].mail,
                    restaurantName: response.data[0].restaurantName,
                    restaurantAddress: response.data[0].restaurantAddress,
                },
                token: generateAccessToken(req.body.login),
            });
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try{
        axios.get('http://localhost:3001/users', {params: {login: req.body.email, password: req.body.password}})
            .then((response: { data: any; }) => {
                res.status(200).send({
                    data: {
                        login: response.data[0].login,
                        mail: response.data[0].mail,
                        restaurantName: response.data[0].restaurantName,
                        restaurantAddress: response.data[0].restaurantAddress,
                    },
                    token: generateAccessToken(req.body.login),
                });
            });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

const generateAccessToken = (username: string) => {
    return jwt.sign(username,  process.env.ACCESS_TOKEN_SECRET as string);
}


export default router;
