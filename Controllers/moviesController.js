
const Movie = require('./../Models/movieModel');
const url = require('url');
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler'); 
const CustomError = require('./../Utils/CustomError'); 
exports.getHighestRated = (req, res, next) => {

    const defaultParams = { sort: '-ratings', limit: '5' };


    const mergedParams = { ...req.query, ...defaultParams };

    const parsedUrl = url.parse(req.url, true);
    parsedUrl.query = mergedParams;
    req.url = url.format(parsedUrl);



    next();
};



exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {

    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();


    const movies = await features.query;

    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies
        }
    })
});

exports.getMovie = asyncErrorHandler(async (req, res,next) => {
    
    const movie = await Movie.findById(req.params.id);
    // console.log(x);
    
    if (! movie) {
        const error = new CustomError('Movie with that ID is not found', 404); 
        return next(error); 
    }
    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    })


});


exports.createMovie = asyncErrorHandler(async (req, res,next) => {

    const movie = await Movie.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            movie
        }
    })
});

exports.updateMovie = asyncErrorHandler(async (req, res,next) => {

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (! updatedMovie) {
        const error = new CustomError('Movie with that ID is not found', 404); 
        return next(error); 
    }
    res.status(200).json({
        status: 'success',
        data: {
            movie: updatedMovie
        }
    })

});

exports.deleteMovie = asyncErrorHandler(async (req, res,next) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (! deletedMovie) {
        const error = new CustomError('Movie with that ID is not found', 404); 
        return next(error); 
    }
    res.status(204).json({
        status: 'success',
        data: {
            movie: null
        }
    })

});

exports.getMovieStatus = asyncErrorHandler(async (req, res,next) => {

    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 4.5 } } },
        {
            $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price' },
                movieCount: { $sum: 1 },
            }
        },
        { $sort: { priceTotal: 1 } },
        // { $match: { maxPrice: { $gte: 20 } } },

    ]);

    res.status(200).json({
        status: 'success',
        count: stats.length,
        data: {
            stats
        }
    })

})
exports.getMovieByGenre = asyncErrorHandler(async (req, res,next) => {

    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        { $unwind: '$genres' },
        {
            $group: {
                _id: '$genres',
                movieCount: { $sum: 1 },
                movies: { $push: '$name' }
            }
        },
        { $addFields: { genre: '$_id' } },
        { $project: { id: 0 } },
        { $sort: { movieCount: -1 } },
        { $match: { genre: genre } }
    ]);

    res.status(200).json({
        status: 'success',
        count: movies.length,
        data: {
            movies
        }
    })
}); 