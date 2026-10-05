import type {StructureResolver} from 'sanity/structure'
import {CONFERENCE_DOCUMENT_ID} from './schemaTypes/conference'

export const SINGLETON_TYPES = new Set(['conference'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Conference')
        .id(CONFERENCE_DOCUMENT_ID)
        .child(S.document().schemaType('conference').documentId(CONFERENCE_DOCUMENT_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() ?? '')),
    ])
