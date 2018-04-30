const mongoose = require('mongoose');

const RecipesSchema = new mongoose.Schema({
    image: {
        type: String
        
    },
  ingredients: {
        type: Array
        
    },

    label: {
        type: String
        
    },
  
    
    url: {
        type: String
        
    }
   
});

module.exports = RecipesSchema;