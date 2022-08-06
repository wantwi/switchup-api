//count 
db.getCollection("persons").find({}).count()

//get all document
db.getCollection("persons").find({})

//equality query
//where name = Grace Larson
db.getCollection("persons").find({ "name" : "Grace Larson"})

//where gender = female and age = 40
db.getCollection("persons").find({ gender:'female',age:40})


//COMPARISON OPERATORS**********************
db.getCollection("persons").find({"eyeColor": {"$ne":'red'}})
db.getCollection("persons").find({"age": {"$gte":30,"$lte":32}})

db.getCollection("persons")
.find({"age": {"$gte":35},"favoriteFruit":{"$ne":"banana"}})
.count()


db.getCollection("persons")
.find({"eyeColor":{"$in":["green"]},"favoriteFruit":{"$in":["strawberry"]}})

db.getCollection("persons")
.find({$and:[{"eyeColor":"green"},{"gender":"male"}]})
.count()


db.getCollection("persons")
.find({$and:[{"age":{"$ne":25}},{"age":{"$gte":25}}]})
.sort({age:1}).count()

//not equal to above
db.getCollection("persons")
.find({"age":{"$ne":25},"age":{"$gte":25}})
.count()

//or and in
//db.getCollection("persons").find({$or:[{isActive:true},{eyeColor:"blue"}]})

//db.getCollection("persons").find({$or:[{eyeColor:"green"},{eyeColor:"blue"}]})

//db.getCollection("persons").find({eyeColor:{$in:["green","blue"]}})

//Find all persons who are younger than 24 OR like bananas OR color of the eyes is either green or blue

//db.getCollection("persons").find({$or:[{age:{$lt:24}},{favoriteFruit:"banana"},{eyeColor:{$in:["green","blue"]}}]})
//.count()\


/***
 * Find all persons who are (older than 33 AND not 37 years old) OR live in Italy.  Parentheses indicate precedence of the operations.
 */
//db.getCollection("persons").find({$or:[{$and:[{age:{$gt:33}},{age:{$ne:37}}]},{"company.location.country":"Italy"}]})
//.count()


/**
 * Query array by all or size
 */
//db.getCollection("persons").find({"tags":{$all:["ad","veniam"]}})
//db.getCollection("persons").find({"tags":{$size:5}})


//Find all persons with second tag "ad" and where tags array consists of exactly 3 tags

//db.getCollection("persons").find({$and:[{"tags.1":"ad"},{tags:{$size:3}}]})

//nested array
//db.getCollection("lesson_1").find({"friends.age":{$gt:20, $lt:25}})

//element match
db.getCollection("lesson_1").find({friends:{$elemMatch:{"name":"Lora","age":23}}})
db.getCollection("persons").find({},{name:1, age:1, eyeColor:1, _id:0})


//case insensitive
db.getCollection("persons").find({gender:{$regex:/FEMALE/i}}).count()
db.getCollection("persons").find({gender:"FEMALE"}).count()
