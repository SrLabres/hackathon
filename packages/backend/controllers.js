const DataSchema = require('./schemas/file.schema');
const csv = require('csv-parser');
const { PassThrough } = require('stream');
const mongoose = require('mongoose');

const {JusSchema, ReclameAquiSchema, ProconSchema} = DataSchema;
const DataModelJus = mongoose.model('jus', JusSchema);
const DataModelReclameAqui = mongoose.model('reclameAqui', ReclameAquiSchema);
const DataModelProcon = mongoose.model('procon', ProconSchema);
const DataModelBase = mongoose.model('base', DataSchema.baseSchema);

const getDataFromModel = async (model, criteria) => model.findOne(criteria);
const calculateScore = (item, jus, procon, reclameAqui) => {
  let score = 0;

  score += procon?.Houve_Reclamacao === 'Sim' ? 50 : 0;
  score += procon?.Foi_Atendida === 'Não' ? 50 : 0;
  score += reclameAqui?.Houve_Reclamacao === 'Sim' ? 25 : 0;
  score += reclameAqui?.Foi_Atendida === 'Não' ? 25 : 0;

  if (jus) {
      score += jus.Total ? jus.Total * 50 * 1.1 : 0;
      score += jus.Frequencia ? jus.Frequencia * 50 * 1.2 : 0;
      score += jus.Mesmo_Segmento ? jus.Mesmo_Segmento * 50 : 0;
  }
  
  score += item.PROCESSO === 'Sim' ? 250 : 0;

  return score;
};

const getProcessedData = async (item) => {
  const criteria = { NUM_PESSOA: item.NUM_PESSOA };
  const [jus, procon, reclameAqui] = await Promise.all([
      getDataFromModel(DataModelJus, criteria),
      getDataFromModel(DataModelProcon, criteria),
      getDataFromModel(DataModelReclameAqui, criteria)
  ]);

  const score = calculateScore(item, jus, procon, reclameAqui);

  return {
      ...item._doc,
      score,
      percent: (score / 1000) * 100,
      jus,
      procon,
      reclameAqui
  };
};

const getHomePage = (req, res) => {
    res.send('Olá, Mundo!');
};

const uploadFile = async (req, res) => {
  const results = [];
    const buffer = req.file.buffer;
    const bufferStream = new require('stream').PassThrough();
    
    bufferStream.end(buffer);

    bufferStream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        const bulkOps = results.map(item => ({
            insertOne: {
                document: item
            }
        }));
        console.log(results[0])
        try {
            switch (req.params.collection) {
                case 'jusbrasil':
                    await DataModelJus.bulkWrite(bulkOps);
                    break;
                case 'reclameaqui':
                    await DataModelReclameAqui.bulkWrite(bulkOps);
                    break;
                case 'procon':
                    await DataModelProcon.bulkWrite(bulkOps);
                    break;
                default:
                    await DataModelBase.bulkWrite(bulkOps);
            }
            res.send(results);
        } catch (err) {
            console.log(err);
            res.status(500).send('Error processing the CSV data.');
        }
    });
};

const getData = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
  };

  const data = await DataModelBase.find({}, null, options);
  const results = await Promise.all(data.map(getProcessedData));

  res.send({
      data: results,
      pagination: {
          page: options.page,
          limit: options.limit,
          next: options.page + 1,
          prev: options.page - 1
      }
  });
};


module.exports = {
  getHomePage,
  uploadFile,
  getData
};