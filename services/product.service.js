const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');

const { models } = require('../libs/sequelize');

class ProductsService {

  constructor(){
    this.products = [];
    this.generate();
  }

  generate(){
    const limit = 100;
    for(let i = 0; i < limit; i++){
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
        isBlock: faker.datatype.boolean(),
      });
    };
  }

  async create(data){
    const newProduct = await models.Product.create(data, {
      include: ['category']
    });
    return newProduct;
  }

  async find(query){
    const options = {
      include: ['category'],
      where: {}
    }
    const { limit, offset } = query;
    if( limit && offset ){
      options.limit = limit;
      options.offset = offset;
    };
    const { price } = query;
    if(price){
      options.where.price = price;
    };
    const { price_min, price_max } = query;
    if(price_min && price_max){
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max
      };
    };
    const products = await models.Product.findAll(options);
    return products;
  }

  async findOne(id){
    const product = await models.Product.findByPk(id);
    if(!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async update(id, changes){
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id){
    const model = await this.findOne(id);
    const rta = await model.destroy();
    return { rta: true };
  }
}

module.exports = ProductsService;
