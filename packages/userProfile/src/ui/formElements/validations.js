import * as yup from 'yup'
import { cloneDeep, concat, isString, merge, reduce, values } from 'lodash'

import {
  isDatatypeSelected,
  isInitialSubmissionReady,
} from '../../helpers/status'

const stripHTML = html => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const isCreditEmpty = arr => {
  if (!arr) return true
  if (arr.length === 0) return true
  if (arr.length === 1 && arr[0] === '') return true
  return false
}

const isStringFieldEmpty = str => {
  if (!str) return true
  if (str.length === 0) return true
  return false
}

// eslint-disable-next-line func-names, prefer-arrow-callback, object-shorthand
const validateWBExists = function(val) {
  if (!val) return true

  const { WBId } = this.parent
  if (!WBId || !WBId.length) return false

  return true
}

const initial = {
  acknowledgements: yup.string(),
  author: yup.object().shape({
    affiliations: yup.string().required('Must provide author affiliations'),
    credit: yup
      .array()
      .of(yup.string().required('Must choose credit to assign to the author'))
      .required('Must choose credit to assign to the author'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email adress')
      .nullable(),
    name: yup.string().required('Name is required'),
    // .test(
    //   'is author valid',
    //   'Must be a registered WormBase Person',
    //   validateWBExists,
    // ),
    WBId: yup.string(),
  }),
  coAuthors: yup.array(
    yup.object().shape({
      affiliations: yup.string().test(
        'co-auhtor affiliations pass if all fields are empty',
        'Affiliations are required for all authors',
        // eslint-disable-next-line func-names, prefer-arrow-callback
        function(val) {
          const { credit, name } = this.parent
          if (isCreditEmpty(credit) && isStringFieldEmpty(name)) return true
          if (isStringFieldEmpty(val)) return false
          return true
        },
      ),
      credit: yup
        .array()
        .of(yup.string())
        .test(
          'coauthor has credit',
          'Credit is required for all authors',
          // eslint-disable-next-line func-names, prefer-arrow-callback
          function(val) {
            const { affiliations, name } = this.parent

            if (isStringFieldEmpty(affiliations) && isStringFieldEmpty(name)) {
              return true
            }

            if (isCreditEmpty(val)) return false

            return true
          },
        )
        .nullable(),
      name: yup.string().test(
        'co-author pass if all fields empty',
        'Name is required for all authors',
        // eslint-disable-next-line func-names, prefer-arrow-callback
        function(val) {
          if (val && val.length > 0) return true

          const { affiliations, credit } = this.parent
          if (isStringFieldEmpty(affiliations) && isCreditEmpty(credit)) {
            return true
          }

          return false
        },
      ),
      // .test(
      //   'is co-author valid',
      //   'Must be a registered WormBase Person',
      //   validateWBExists,
      // )
    }),
  ),
  comments: yup.string(),
  disclaimer: yup.boolean().test('disclaimer', 'Required', val => val),
  funding: yup.string().required('Funding is required'),
  image: yup.object().shape({
    url: yup.string().required('Image is required'),
  }),
  imageCaption: yup
    .string()
    .test(
      'image-caption-not-empty',
      'Image caption is required',
      val => stripHTML(val).length > 0,
    ),
  laboratory: yup.object().shape({
    name: yup.string().required('Laboratory is required'),
    // .test(
    //   'is-lab-valid',
    //   'Must a registered WormBase Laboratory',
    //   validateWBExists,
    // )
    WBId: yup.string(),
  }),
  methods: yup
    .string()
    .test(
      'methods-not-empty',
      'Methods & Reagents is required',
      val => stripHTML(val).length > 0,
    ),
  patternDescription: yup
    .string()
    .test(
      'pattern-description-not-empty',
      'Pattern description is required',
      val => stripHTML(val).length > 0,
    ),
  references: yup
    .string()
    .test(
      'references-not-empty',
      'References are required',
      val => stripHTML(val).length > 0,
    ),
  suggestedReviewer: yup.object().shape({
    name: yup.string(),
    // .test(
    //   'is suggested reviewer valid',
    //   'Must be a registered WormBase Person',
    //   validateWBExists,
    // )
  }),
  title: yup
    .string()
    .test(
      'title-not-empty',
      'Title is required',
      val => stripHTML(val).length > 0,
    ),
}

const selectDataType = {
  dataType: yup.string().required('Datatype is required'),
}

const geneExpression = {
  geneExpression: yup.object().shape({
    antibodyUsed: yup.string().when(['detectionMethod'], {
      is: val => val === 'antibody',
      then: yup.string().required('Antibody is required'),
    }),
    backboneVector: yup
      .object()
      .shape({
        name: yup.string(),
        WBId: yup.string(),
      })
      .when('detectionMethod', {
        is: val => val === 'newTransgene',
        then: yup.object().shape({
          name: yup
            .string()
            .test(
              'is backbone vector valid',
              'Must be a valid WormBase vector',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
    coinjected: yup.string(),
    constructComments: yup.string(),
    constructionDetails: yup.string().when(['detectionMethod'], {
      is: val => val === 'newTransgene',
      then: yup.string().required('Construction details are required'),
    }),
    detectionMethod: yup.string().required('Detection method is required'),
    dnaSequence: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string(),
        }),
      )
      .when(['detectionMethod'], {
        is: val => val === 'newTransgene',
        then: yup
          .array()
          .of(
            yup.object().shape({
              name: yup.string(),
            }),
          )
          .min(1, 'Provide at least one DNA sequence')
          .max(10)
          .compact(val => val.name === ''),
      }),
    expressionPattern: yup.object().shape({
      name: yup
        .string()
        .required('Expression pattern is required')
        .test(
          'is expression pattern valid',
          'Must be a valid WormBase expression pattern',
          validateWBExists,
        ),
      WBId: yup.string(),
    }),
    fusionType: yup
      .object()
      .shape({
        name: yup.string(),
        WBId: yup.string(),
      })
      .when(['detectionMethod'], {
        is: val => val === 'newTransgene',
        then: yup.object().shape({
          name: yup
            .string()
            .required('Fusion type is required')
            .test(
              'is fusion type valid',
              'Must be a valid WormBase fusion type',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
    genotype: yup.string().when(['detectionMethod'], {
      is: val => val === 'newTransgene',
      then: yup.string().required('Genotype is required'),
    }),
    injectionConcentration: yup.string(),
    inSituDetails: yup.string().when(['detectionMethod'], {
      is: val => val === 'inSituHybridization',
      then: yup.string().required('In Situ Details are required'),
    }),
    integratedBy: yup
      .object()
      .shape({
        name: yup.string(),
        WBId: yup.string(),
      })
      .when(['detectionMethod'], {
        is: val => val === 'newTransgene',
        then: yup.object().shape({
          name: yup
            .string()
            .required('Integration type is required')
            .test(
              'is integration type valid',
              'Must be a valid WormBase integration type',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
    observeExpression: yup
      .object()
      .shape({
        certainly: yup.array().of(
          yup.object().shape({
            certainly: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is certainly valid',
                  'Expression fields must be valid WormBase body locations',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            during: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is certainly during valid',
                  'During fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            id: yup.string().nullable(),
            subcellularLocalization: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is certainly subcell valid',
                  'Subcellular localization fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
          }),
        ),
        not: yup.array().of(
          yup.object().shape({
            during: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is not during valid',
                  'During fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            id: yup.string().nullable(),
            not: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is not valid',
                  'Expression fields must be valid WormBase body locations',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            subcellularLocalization: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is not subcell valid',
                  'Subcellular localization fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
          }),
        ),
        partially: yup.array().of(
          yup.object().shape({
            during: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is partially during valid',
                  'During fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            id: yup.string().nullable(),
            partially: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is partially valid',
                  'Expression fields must be valid WormBase body locations',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            subcellularLocalization: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is partially subcell valid',
                  'Subcellular localization fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
          }),
        ),
        possibly: yup.array().of(
          yup.object().shape({
            during: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is possibly during valid',
                  'During fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            id: yup.string().nullable(),
            possibly: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is possibly valid',
                  'Expression fields must be valid WormBase body locations',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
            subcellularLocalization: yup.object().shape({
              name: yup
                .string()
                .test(
                  'is possibly subcell valid',
                  'Subcellular localization fields must be valid WormBase life stages',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
          }),
        ),
      })
      .test('observe expression test', 'Fill in at least one field', val => {
        const flatFirstLevel = reduce(values(val), (result, item) =>
          concat(result, item),
        )

        let flatValues = []

        flatFirstLevel.forEach(obj => {
          flatValues = concat(
            flatValues,
            values(obj).filter(item => !isString(item)),
          )
        })

        return flatValues.find(item => {
          if (item === null) return false
          return (
            (item.value && item.value.length > 0) ||
            (item.name && item.name.length > 0)
          )
        })
      }),
    reporter: yup
      .object()
      .shape({
        name: yup.string(),
        WBId: yup.string(),
      })
      .when(['detectionMethod'], {
        is: val => val === 'newTransgene',
        then: yup.object().shape({
          name: yup
            .string()
            .required('Reporter is required')
            .test(
              'is reporter valid',
              'Must be a valid WormBase protein',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
    species: yup.object().shape({
      name: yup
        .string()
        .required('Species is required')
        .test(
          'is species valid',
          'Must be a valid WormBase species',
          validateWBExists,
        ),
      WBId: yup.string(),
    }),
    strain: yup.string(),
    transgeneName: yup.string().when(['detectionMethod'], {
      is: val => val === 'newTransgene',
      then: yup.string().required('Transgene name is required'),
    }),
    transgeneUsed: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string(),
          WBId: yup.string(),
        }),
      )
      .when(['detectionMethod'], {
        is: val => val === 'existingTransgene',
        then: yup
          .array()
          .of(
            yup.object().shape({
              name: yup
                .string()
                .test(
                  'is transgene valid',
                  'Must be a valid WormBase transgene',
                  validateWBExists,
                ),
              WBId: yup.string(),
            }),
          )
          .min(1, 'Provide at least one transgene')
          .max(10)
          .compact(val => val.name === ''),
      }),
    utr: yup
      .object()
      .shape({
        name: yup.string(),
        WBId: yup.string(),
      })
      .when('detectionMethod', {
        is: val => val === 'newTransgene',
        then: yup.object().shape({
          name: yup
            .string()
            .test(
              'is utr valid',
              'Must be a valid WormBase gene',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
    variation: yup
      .object()
      .shape({
        name: yup
          .string()
          .test(
            'is variation valid',
            'Must be a valid WormBase variation',
            validateWBExists,
          ),
        WBId: yup.string(),
      })
      .when('detectionMethod', {
        is: val => val === 'genomeEditing',
        then: yup.object().shape({
          name: yup
            .string()
            .required('Variation is required')
            .test(
              'is variation valid',
              'Must be a valid WormBase variation',
              validateWBExists,
            ),
          WBId: yup.string(),
        }),
      }),
  }),
}

const makeSchema = vals => {
  const schema = cloneDeep(initial)
  const { status } = vals

  if (isInitialSubmissionReady(status)) {
    merge(schema, selectDataType)
  }

  if (isDatatypeSelected(status)) {
    if (vals.dataType === 'geneExpression') {
      merge(schema, geneExpression)
    }
  }

  return yup.object().shape(schema)
}

export default makeSchema
