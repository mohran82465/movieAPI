const mongoose = require("mongoose");
const fs = require('fs'); 
const moviesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true

    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
        default: 1.0,
        min:1,
        max:10,
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required!"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, "Genres  is required!"]

    },
    directors: {
        type: [String],
        required: [true, "Directors  is required!"]

    },
    coverImage: {
        type: String,
        required: [true, "Cover Image  is required!"]

    },
    actors: {
        type: [String],
        required: [true, "Actors  is required!"]

    },
    price: {
        type: Number,
        required: [true, "Price  is required!"]

    },
    createdBy:String,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

moviesSchema.virtual('durationInHours').get(function () {
    return this.duration / 60;
});

moviesSchema.pre('save',function(next){
    this.createdBy = 'MohamedMohran'; 
    next();
})

moviesSchema.post('save', function(doc, next){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`; 
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{console.log(err.message);})
    next(); 
})

// moviesSchema.pre(/^find/, function(next){
//     this.find({releaseDate: {$lte: Date.now()}}); 
//     this.startTime = Date.now(); 
//     next();
// })
// moviesSchema.post(/^find/, function(docs,next){
//     this.endTime = Date.now(); 
//     const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents \n`; 
//     fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{console.log(err.message);})


//     next();
// })

const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie; 