import { DocAgnosticFormat, ObjectMap, TypeDefinitionByName } from '@0x/types';

import { each, isEmpty, keyBy, keys, map, sortBy } from 'lodash-es';
import { ALink } from 'ts/types';
import { utils } from 'ts/utils/utils';

import {
    ContractsByVersionByNetworkId,
    DocsInfoConfig,
    DocsMenu,
    SectionNameToMarkdownByVersion,
    SectionsMap,
    SupportedDocJson,
} from '../types';

import { constants } from './constants';

export class DocsInfo {
    public id: string;
    public type: SupportedDocJson;
    public displayName: string;
    public packageName: string;
    public packageUrl: string;
    public markdownMenu: DocsMenu;
    public typeSectionName: string;
    public sections: SectionsMap;
    public sectionNameToMarkdownByVersion: SectionNameToMarkdownByVersion;
    public contractsByVersionByNetworkId?: ContractsByVersionByNetworkId;
    constructor(config: DocsInfoConfig) {
        this.id = config.id;
        this.type = config.type;
        this.markdownMenu = config.markdownMenu;
        this.displayName = config.displayName;
        this.packageName = config.packageName;
        this.packageUrl = config.packageUrl;
        this.typeSectionName = config.type === SupportedDocJson.SolDoc ? 'structs' : 'types';
        this.sections = config.markdownSections;
        this.sectionNameToMarkdownByVersion = config.sectionNameToMarkdownByVersion;
        this.contractsByVersionByNetworkId = config.contractsByVersionByNetworkId;
    }
    public getTypeDefinitionsByName(docAgnosticFormat: DocAgnosticFormat): ObjectMap<TypeDefinitionByName> {
        if (docAgnosticFormat[this.typeSectionName] === undefined) {
            return {};
        }

        const section = docAgnosticFormat[this.typeSectionName];
        const typeDefinitionByName = keyBy(section.types, 'name') as any;
        return typeDefinitionByName;
    }
    public getSectionNameToLinks(docAgnosticFormat: DocAgnosticFormat): ObjectMap<ALink[]> {
        const sectionNameToLinks: ObjectMap<ALink[]> = {};
        each(this.markdownMenu, (linkTitles, sectionName) => {
            sectionNameToLinks[sectionName] = [];
            each(linkTitles, (linkTitle) => {
                const to = utils.getIdFromName(linkTitle);
                const links = sectionNameToLinks[sectionName];
                links.push({
                    title: linkTitle,
                    to,
                });
            });
        });

        if (docAgnosticFormat === undefined) {
            return sectionNameToLinks;
        }

        const docSections = keys(this.sections);
        each(docSections, (sectionName) => {
            const docSection = docAgnosticFormat[sectionName];
            if (docSection === undefined || sectionName === constants.EXTERNAL_EXPORTS_SECTION_NAME) {
                return; // no-op
            }

            const isExportedFunctionSection =
                docSection.functions.length === 1 &&
                isEmpty(docSection.types) &&
                isEmpty(docSection.methods) &&
                isEmpty(docSection.constructors) &&
                isEmpty(docSection.properties) &&
                isEmpty(docSection.events);

            if (sectionName === this.typeSectionName) {
                const sortedTypesNames = sortBy(docSection.types, 'name');
                const typeNames = map(sortedTypesNames, (t) => t.name);
                const typeLinks = map(typeNames, (typeName) => {
                    return {
                        to: `${sectionName}-${typeName}`,
                        title: typeName,
                    };
                });
                sectionNameToLinks[sectionName] = typeLinks;
            } else if (isExportedFunctionSection) {
                // Noop so that we don't have the method listed underneath itself.
            } else {
                let eventNames: string[] = [];
                if (docSection.events !== undefined) {
                    const sortedEventNames = sortBy(docSection.events, 'name');
                    eventNames = map(sortedEventNames, (m) => m.name);
                }
                const propertiesSortedByName = sortBy(docSection.properties, 'name');
                const propertyNames = map(propertiesSortedByName, (m) => m.name);
                const methodsSortedByName = sortBy(docSection.methods, 'name');
                const methodNames = map(methodsSortedByName, (m) => m.name);
                const sortedFunctionNames = sortBy(docSection.functions, 'name');
                const functionNames = map(sortedFunctionNames, (m) => m.name);
                const names = [...eventNames, ...propertyNames, ...functionNames, ...methodNames];

                const links = map(names, (name) => {
                    return {
                        to: `${sectionName}-${name}`,
                        title: name,
                    };
                });

                sectionNameToLinks[sectionName] = links;
            }
        });
        return sectionNameToLinks;
    }
}
