const path = require('path');
const Boom = require('boom');
const mongoose = require('mongoose');
const joi = require('joi');
const _ = require('lodash');



const User = mongoose.model('User');
const RecipesSchema = require(path.resolve('models/user_recipes_schema'));
const UserPref = mongoose.model('UserPref', RecipesSchema);

const endpoints = [
    {
        method: 'GET',
        path: '/recipes',
        config: {
            auth: 'jwt'
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            return loggedInUser.recipes;
        }
    },
    {
        method: 'POST',
        path: '/recipes',
        config: {
            auth: 'jwt',
            validate: {
                payload: {
                image: joi.string().min(5),
                  ingredients:joi.array(),
                  label:joi.string().min(1),
                  url:joi.string()
                   
                } 
            }
           
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            const userPref = new UserPref(request.payload);
            
            loggedInUser.recipes.push(userPref);
            
           try {
                const modifiedUser = await loggedInUser.save();
                return modifiedUser.recipes;
            } catch (e) {
                return Boom.badRequest(e.message);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/recipes/{recipesId}',
        config: {
            auth: 'jwt',
            validate: {
                params: {
                    recipesId: joi.string().required()
                }
            }
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            const recipesIndex = _.findIndex(loggedInUser.recipes, function (currentRecipes) {
                return (currentRecipes._id.toString() === request.params.recipesId);
            });
            if (recipesIndex === -1) {
                return Boom.badRequest('Recipe Not found');
            }
            loggedInUser.recipes.splice(recipesIndex, 1);
            try {
                const modifiedUser = await loggedInUser.save();
                return modifiedUser.recipes;
            } catch (e) {
                return Boom.badRequest(e.message);
            }
        }
    }
];

module.exports = endpoints;