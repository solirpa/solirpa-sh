import { values } from './rpc';
import Slugger from 'github-slugger';
import { normalizeSlug } from '../blog-helpers';
import queryCollection from './queryCollection';
import getPageData from './getPageData';
import { BlockType } from 'react-notion';

export default async function getTableData<T>(
  tableId: any,
  isPosts = false
): Promise<T[]> {
  const slugger = new Slugger();
  const tableBlocks = await getPageData(tableId);

  const tableBlock = tableBlocks.find(
    (block: BlockType) => block.value.type === 'collection_view'
  );

  if (!tableBlock) return;

  const { value } = tableBlock;

  let table: any = [];
  const col = await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0],
  });
  const entries = values(col.recordMap.block).filter((block: any) => {
    return block.value && block.value.parent_id === value.collection_id;
  });

  const colId = Object.keys(col.recordMap.collection)[0];
  const schema = col.recordMap.collection[colId].value.schema;
  const schemaKeys = Object.keys(schema);

  for (const entry of entries) {
    const props = entry.value && entry.value.properties;
    const row: any = {};

    if (!props) continue;
    if (entry.value.content) {
      row.id = entry.value.id;
    }

    schemaKeys.forEach((key) => {
      // might be undefined
      let val = props[key] && props[key][0];

      if (['slug', 'preview'].indexOf(schema[key].name) >= 0) {
        val = val && val.length ? val[0] : null;
      }

      if (schema[key].name === 'types') {
        val = val[0].split(',');
      }

      if (schema[key].name === 'published') {
        val = val[0] === 'Yes' ? true : false;
      }

      // authors and blocks are centralized
      if (val && props[key][0][1]) {
        const type = props[key][0][1][0];

        switch (type[0]) {
          case 'a':
            {
              // link
              val = type[1];

              if (schema[key].name === 'images') {
                val = [
                  {
                    name: props[key][0][0],
                    url: type[1].match('.amazonaws.com/secure.notion-static.com/') ? `/api/asset?assetUrl=${type[1]}&blockId=${entry.value.id}` : type[1],
                    rawUrl: type[1],
                  },
                ];
              }
            }
            break;
          case 'u': // user
            val = props[key]
              .filter((arr: any[]) => arr.length > 1)
              .map((arr: any[]) => arr[1][0][1]);
            break;
          case 'p': // page (block)
            const page = col.recordMap.block[type[1]];
            row.id = page.value.id;
            val = page.value.properties.title[0][0];
            break;
          case 'd': // date
            // start_date: 2019-06-18
            // start_time: 07:00
            // time_zone: Europe/Berlin, America/Los_Angeles

            if (!type[1].start_date) {
              break;
            }

            // initialize subtracting time zone offset
            val = type[1].start_date;
            break;
          default:
            console.error('unknown type', type[0], type);
            break;
        }
      }

      if (typeof val === 'string') {
        val = val.trim();
      }
      row[schema[key].name] = val || null;
    });

    // console.log('row', row, row.slug || slugger.slug(row.title || ''))
    // auto-generate slug from title
    row.slug = normalizeSlug(row.slug || slugger.slug(row.title || ''));

    const key = row.slug;
    if (isPosts && !key) continue;

    if (key) {
      table.push(row);
    } else {
      if (!Array.isArray(table)) table = [];
      table.push(row);
    }
  }
  return table;
}
