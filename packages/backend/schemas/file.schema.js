const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jusSchema = new Schema({}, { strict: false });

const reclameAquiSchema = new Schema({}, { strict: false });

const proconSchema = new Schema({}, { strict: false });

const baseSchema = new Schema({}, { strict: false });
const fileSchema = {
    JusSchema: jusSchema,
    ReclameAquiSchema: reclameAquiSchema,
    ProconSchema: proconSchema,
    baseSchema: baseSchema
}
module.exports = fileSchema