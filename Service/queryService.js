var getData = function (model, query, projection, options, callback) {

    model.find(query, projection, options, function (err, data) {
        if (err) {

            return callback(err);
        }
        return callback(null, data);
    });
};

var getOneData=function(model,query,projection,options,callback) {
  model.findOne(query,projection,options,function(err,data){
     if(err){
         return callback(err);
     }
      return callback(null,data);

  });

};


var aggregateData = function (model, group, callback) {
    model.aggregate(group, function (err, data) {

        if (err) {

            return callback(err);
        }
        return callback(null, data);
    });
};


var setData = function (model, data, callback) {

    new model(data).save(function (err, resultData) {

        if (err) {

            return callback(err);
        }

        var result = resultData.toObject();
        delete result.__v;
       return  callback(null, result);

    });
};



var deleteData = function (model, conditions, callback) {

    model.remove(conditions, function (err, removed) {

        if (err) {

            return callback(err);
        }
        return callback(null, removed);


    });
};


var batchInsert = function (model, batchData, options, callback) {
    model.collection.insert(batchData, options, function (error, docs) {

        if (error) {

            return callback(error);
        }

        return callback(null, docs);

    });
};


exports.getCount = function (model, condition, callback) {
    model.count(condition, function (error, count) {
        if (error) {

            return callback(error);
        }
        return callback(null, count);
    })
};


var updateData = function (model, conditions, update, options, callback) {
    model.update(conditions, update, options, function (err, result) {

        if (err) {

            return callback(err);
        }

        return callback(null, result);

    });
};


var getDataDeepPopulateThreeLevel = function (model, query, projectionQuery, options, populateModel, nestedModel, callback) {

    model.find(query, projectionQuery, options).populate(populateModel)
        .exec(function (err, docs) {

            if (err) return callback(err);

            model.populate(docs, nestedModel,
                function (err, populatedDocs) {
                    if (err) return callback(err);
                    callback(null, populatedDocs);// This object should now be populated accordingly.
                });
        });
};

var getDataDeepPopulateFourLevel = function (model, query, projectionQuery, options, populateModel, nestedModel, deepNestedModel, callback) {

    model.find(query, projectionQuery, options).populate(populateModel)
        .exec(function (err, docs) {

            if (err) return callback(err);

            model.populate(docs, nestedModel,
                function (err, populatedDocs) {

                    if (err) return callback(err);
                    model.populate(populatedDocs, deepNestedModel,
                        function (err, deepPopulatedDocs) {
                            if (err) return callback(err);
                            callback(null, deepPopulatedDocs);
                        });
                });
        });
};

var getDistinctData = function (model, field, condition, callback) {
    model.distinct(field, condition, function (error, result) {
        if (error) {
            logger.error("Distinct Data", error);
            return callback(error);
        }
        return callback(null, result);
    })
};

var findOneAndUpdateData = function (model, conditions, update, options, callback) {
    model.findOneAndUpdate(conditions, update, options, function (error, result) {
        if (error) {
            logger.error("Find one and update", error);
            return callback(error);
        }
        return callback(null, result);
    })
};


var getDataWithReference = function (model, query, projection, options, collectionOptions, callback) {
    model.find(query, projection, options).populate(collectionOptions).exec(function (err, data) {

        if (err) {

            return callback(err);
        }
        return callback(null, data);

    });
};

module.exports={
    getData:getData,
    aggregateData:aggregateData,
    setData:setData,
    deleteData:deleteData,
    batchInsert:batchInsert,
    updateData:updateData,
    getDataDeepPopulateThreeLevel:getDataDeepPopulateThreeLevel,
    findOneAndUpdateData:findOneAndUpdateData,
    getDataWithReference:getDataWithReference,
    getOneData:getOneData,




}