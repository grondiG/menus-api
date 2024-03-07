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
        .then((response: { data: any; }) => {
            if(response.data.length !== 0) {
                res.status(200).send({
                    data: {
                        login: response.data[0]?.login,
                        mail: response.data[0]?.mail,
                        restaurantName: response.data[0]?.restaurantName,
                        restaurantAddress: response.data[0]?.restaurantAddress,
                    },
                    token: generateAccessToken(req.body.login),
                });
            }
            else{
                res.sendStatus(401).json({
                    message: "Invalid credentials."
                });
            }
        });
    }
    catch (e) {
        res.sendStatus(500).json({
            message: "Internal server error."
        });
    }
});

router.post('/login', async (req, res) => {
    try{
        axios.get('http://localhost:3001/users', {params: {login: req.body.email, password: req.body.password}})
            .then((response: { data: any; }) => {
                if(response.data.length === 0){
                    res.status(401).json({
                        message: "Invalid login or password."
                    });
                    return;
                }
                else{
                    res.status(200).send({
                        data: {
                            login: response.data[0]?.login,
                            mail: response.data[0]?.mail,
                            restaurantName: response.data[0]?.restaurantName,
                            restaurantAddress: response.data[0]?.restaurantAddress,
                        },
                        token: generateAccessToken(req.body.login),
                    });
                    return;
                }
            });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});

router.get('/isTokenValid', authenticateToken, async (req, res) => {
    try{
        const token: string = (req.headers['authorization'] as string).split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, data: any) => {
            if(err){
                res.sendStatus(403);
                return;
            }

            axios.get('http://localhost:3001/users', {params: {login: data.username}})
                .then((response: { data: any; }) => {
                    if(response.data.length === 0){
                        res.sendStatus(404);
                        return;
                    }
                    else{
                        res.status(200).send({
                            data: {
                                login: response.data[0]?.login,
                                mail: response.data[0]?.mail,
                                restaurantName: response.data[0]?.restaurantName,
                                restaurantAddress: response.data[0]?.restaurantAddress,
                            },
                            token: token,
                        });
                        return;
                    }
                });
        });
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/ifNameExists', async (req, res) => {
    try{
        if(req.query.name === undefined){
            res.status(400).send({
                message: "Name is required."
            });
            return;
        }
        axios.get('http://localhost:3001/users', {params: {login: req.query.name}})
            .then((response: { data: any; }) => {
                console.log(response.data)
                if(response.data.length === 0){
                    res.status(200).send({
                        exists: false,
                    });
                    return;
                }
                else{
                    res.status(200).send({
                        exists: true,
                    });
                    return;
                }
            });
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/order', authenticateToken, async (req, res) => {
    try{
        axios.post('http://localhost:3001/orders', req.body)
            .then((response: { data: any; }) => {
                if(response.data.length !== 0) {
                    res.status(200).send(response.data);
                }
                else{
                    res.sendStatus(401).json({
                        message: "Invalid credentials."
                    });
                }
            });
    }
    catch (e) {
        res.sendStatus(500).json({
            message: "Internal server error."
        });
    }
});


const generateAccessToken = (username: string) => {
    return jwt.sign({username: username},  process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1800s' });
}


export default router;
