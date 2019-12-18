import * as React from 'react';
import Autosuggest from 'react-autosuggest';
import { connectAutoComplete, Highlight, Snippet } from 'react-instantsearch-dom';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { scroller } from 'react-scroll';

import { Link } from 'ts/components/documentation/shared/link';

import { AutocompleteOverlay } from 'ts/components/docs/search/autocomplete_overlay';
import { AutocompleteWrapper } from 'ts/components/docs/search/autocomplete_wrapper';

import { docs } from 'ts/style/docs';
import { getNameToSearchIndex } from 'ts/utils/algolia_constants';
import { environments } from 'ts/utils/environments';

export interface IHit {
    description: string;
    difficulty?: string;
    externalUrl?: string;
    hash?: string;
    id: number | string;
    isCommunity?: boolean;
    isFeatured?: boolean;
    objectID: string;
    sectionUrl: string;
    tags?: string[];
    textContent: string;
    title: string;
    type?: string;
    url?: string;
    urlWithHash?: string;
    _highlightResult?: any;
    _snippetResult?: any;
}

interface IAutoCompleteProps extends RouteComponentProps<{}> {
    isHome?: boolean;
    hits?: IHits[];
    currentRefinement?: string;
    refine?: (value: string) => void;
}

interface IHits {
    index: string;
    hits: IHit[];
}

const CustomAutoComplete: React.FC<IAutoCompleteProps> = ({
    isHome = false,
    hits = [],
    currentRefinement,
    refine,
    history,
    location,
}) => {
    const [value, setValue] = React.useState<string>('');
    const [hasOverlay, setHasOverlay] = React.useState<boolean>(false);
    let inputRef: HTMLInputElement;

    React.useEffect(() => {
        const handleKeyUp: any = (event: React.KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setValue('');
                inputRef.blur();
            }
        };

        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const onSuggestionsFetchRequested = ({ value: newValue }: { value: string }): void => refine(newValue);

    const onSuggestionsClearRequested = (): void => refine('');

    const onSuggestionSelected = (event: React.KeyboardEvent, { suggestion }: { suggestion: IHit }): void => {
        const { externalUrl, hash, url, urlWithHash } = suggestion;

        if (!externalUrl) {
            // If there is a hash (fragment identifier) and the user is currently
            // on the same page, scroll to content. If not, route away to the doc page.
            if (hash && location.pathname === url) {
                const id = hash.substring(1); // Get rid of # symbol
                scroller.scrollTo(id, {
                    smooth: true,
                    duration: docs.scrollDuration,
                    offset: -docs.headerOffset,
                });
            } else {
                history.push(urlWithHash);
                window.scrollTo(0, 0);
            }
        }

        setValue(''); // Clear input value
        inputRef.blur(); // Blur input
    };

    const storeInputRef = (autosuggest: any): void => {
        if (autosuggest !== null) {
            inputRef = autosuggest.input;
        }
    };

    const onChange = (event: React.KeyboardEvent, { newValue, method }: { newValue: string; method: string }): void => {
        // Only set value if the user typed it in, without it it leads to populating the input with snippet or highlight text
        if (method === 'type') {
            setValue(newValue);
        }
    };

    const onFocus = () => setHasOverlay(true);
    const onBlur = () => setHasOverlay(false);

    const inputProps = {
        placeholder: 'Search docs…',
        onChange,
        onFocus,
        onBlur,
        value,
    };

    const hasNoSuggestions = value.length > 0 && !hits.find((hit: IHits): any => hit.hits.length);

    return (
        <>
            <AutocompleteWrapper hasOverlay={hasOverlay} hasNoSuggestions={hasNoSuggestions} isHome={isHome}>
                <Autosuggest
                    suggestions={hits}
                    ref={storeInputRef}
                    multiSection={true}
                    focusInputOnSuggestionClick={false}
                    onSuggestionSelected={onSuggestionSelected}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    renderSectionTitle={renderSectionTitle}
                    getSectionSuggestions={getSectionSuggestions}
                />
                {hasNoSuggestions && (
                    <div className="react-autosuggest__empty">No results found for "{currentRefinement}"</div>
                )}
            </AutocompleteWrapper>
            {hasOverlay && <AutocompleteOverlay onClick={onBlur} />}
        </>
    );
};

const getSuggestionValue = (hit: IHit): string => hit.textContent;

const renderSuggestion = (hit: IHit): React.ReactNode => {
    const { externalUrl, urlWithHash } = hit;
    const to = externalUrl ? externalUrl : urlWithHash;
    // The atrributes to snippet are set in algolia_constants
    const attributeToSnippet = externalUrl ? 'description' : 'textContent';

    return (
        <Link shouldOpenInNewTab={externalUrl ? true : false} to={to}>
            <Highlight attribute="title" hit={hit} nonHighlightedTagName="h6" />
            <Snippet attribute={attributeToSnippet} hit={hit} nonHighlightedTagName="p" tagName="span" />
        </Link>
    );
};

const renderSectionTitle = (section: any): React.ReactNode => {
    // TODO(fabio): Add `api` below once the API Explore page is ready (ditto in search_input.tsx)
    const nameToSearchIndex = getNameToSearchIndex(environments.getEnvironment());
    const { tools, guides } = nameToSearchIndex;
    const coreConcepts = nameToSearchIndex['core-concepts'];

    const titles: { [key: string]: string } = {
        // TODO: Add this back in when api - explorer page is ready
        // to be indexed and included in the search results (ditto in search_input.tsx)
        // [apiExplorer]: 'Api explorer',
        [coreConcepts]: 'Core concepts',
        [tools]: 'Tools',
        [guides]: 'Guides',
    };

    if (section.hits.length) {
        return <p>{titles[section.index]}</p>;
    }
    return null;
};

const getSectionSuggestions = (section: any): string => section.hits;

export const AutoComplete = connectAutoComplete(withRouter(CustomAutoComplete));
