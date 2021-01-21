import { BlockMapType, BlockType } from 'react-notion';
import rpc, { values } from './rpc';

export default async function getPageData(pageId: string) {
  try {
    const data = await loadPageChunk({ pageId });
    const blocks = values(data.recordMap.block);

    for (let block of blocks) {
      if (block.value.type === 'toggle') {
        const subData = await syncRecordValues({
          requests: block.value.content.map((i) => ({
            table: 'block',
            id: i,
            version: -1,
          })),
        });
        const subBlocks = values(subData.recordMap.block);
        blocks.push(...subBlocks);
      }
    }

    return blocks;
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err);
    return [];
  }
}

export function loadPageChunk({
  pageId,
  limit = 300,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false,
}: any) {
  return rpc('loadPageChunk', {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns,
  });
}

export function syncRecordValues({ requests = [] }: any) {
  return rpc('syncRecordValues', {
    requests,
  });
}
