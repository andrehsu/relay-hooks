/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+relay
 * @flow strict-local
 * @format
 */

// flowlint ambiguous-object-type:error

'use strict';

import * as invariant from 'fbjs/lib/invariant';
import * as warning from 'fbjs/lib/warning';

import { ReaderPaginationMetadata, Variables } from 'relay-runtime';

export function getPaginationVariables(
    direction: 'forward' | 'backward',
    count: number,
    cursor: string | null,
    baseVariables: Variables,
    extraVariables: Variables,
    paginationMetadata: ReaderPaginationMetadata,
): { [key: string]: any } {
    const { backward: backwardMetadata, forward: forwardMetadata } = paginationMetadata;

    if (direction === 'backward') {
        invariant(
            backwardMetadata != null &&
                backwardMetadata.count != null &&
                backwardMetadata.cursor != null,
            'Relay: Expected backward pagination metadata to be available. ' +
                "If you're seeing this, this is likely a bug in Relay.",
        );
        warning(
            !extraVariables.hasOwnProperty(backwardMetadata.cursor),
            'Relay: `UNSTABLE_extraVariables` provided by caller should not ' +
                'contain cursor variable `%s`. This variable is automatically ' +
                'determined by Relay.',
            backwardMetadata.cursor,
        );
        warning(
            !extraVariables.hasOwnProperty(backwardMetadata.count),
            'Relay: `UNSTABLE_extraVariables` provided by caller should not ' +
                'contain count variable `%s`. This variable is automatically ' +
                'determined by Relay.',
            backwardMetadata.count,
        );
        const paginationVariables = {
            ...baseVariables,
            ...extraVariables,
            [backwardMetadata.cursor]: cursor,
            [backwardMetadata.count]: count,
        };
        if (forwardMetadata && forwardMetadata.cursor) {
            paginationVariables[forwardMetadata.cursor] = null;
        }
        if (forwardMetadata && forwardMetadata.count) {
            paginationVariables[forwardMetadata.count] = null;
        }
        return paginationVariables;
    }

    invariant(
        forwardMetadata != null && forwardMetadata.count != null && forwardMetadata.cursor != null,
        'Relay: Expected forward pagination metadata to be available. ' +
            "If you're seeing this, this is likely a bug in Relay.",
    );
    warning(
        !extraVariables.hasOwnProperty(forwardMetadata.cursor),
        'Relay: `UNSTABLE_extraVariables` provided by caller should not ' +
            'contain cursor variable `%s`. This variable is automatically ' +
            'determined by Relay.',
        forwardMetadata.cursor,
    );
    warning(
        !extraVariables.hasOwnProperty(forwardMetadata.count),
        'Relay: `UNSTABLE_extraVariables` provided by caller should not ' +
            'contain count variable `%s`. This variable is automatically ' +
            'determined by Relay.',
        forwardMetadata.count,
    );
    const paginationVariables = {
        ...baseVariables,
        ...extraVariables,
        [forwardMetadata.cursor]: cursor,
        [forwardMetadata.count]: count,
    };
    if (backwardMetadata && backwardMetadata.cursor) {
        paginationVariables[backwardMetadata.cursor] = null;
    }
    if (backwardMetadata && backwardMetadata.count) {
        paginationVariables[backwardMetadata.count] = null;
    }
    return paginationVariables;
}
