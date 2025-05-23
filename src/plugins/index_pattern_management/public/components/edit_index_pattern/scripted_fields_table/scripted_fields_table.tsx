/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import { EuiSpacer } from '@elastic/eui';
import {
  getSupportedScriptingLanguages,
  getDeprecatedScriptingLanguages,
} from '../../../scripting_languages';

import { Table, Header, CallOuts, DeleteScritpedFieldConfirmationModal } from './components';
import { ScriptedFieldItem } from './types';

import { IndexPattern, DataPublicPluginStart } from '../../../../../../plugins/data/public';

interface ScriptedFieldsTableProps {
  indexPattern: IndexPattern;
  fieldFilter?: string;
  scriptedFieldLanguageFilter?: string;
  helpers: {
    redirectToRoute: Function;
    getRouteHref?: Function;
  };
  onRemoveField?: () => void;
  painlessDocLink: string;
  saveIndexPattern: DataPublicPluginStart['indexPatterns']['updateSavedObject'];
  useUpdatedUX: boolean;
}

interface ScriptedFieldsTableState {
  deprecatedLangsInUse: string[];
  fieldToDelete: ScriptedFieldItem | undefined;
  isDeleteConfirmationModalVisible: boolean;
  fields: ScriptedFieldItem[];
}

export class ScriptedFieldsTable extends Component<
  ScriptedFieldsTableProps,
  ScriptedFieldsTableState
> {
  constructor(props: ScriptedFieldsTableProps) {
    super(props);

    this.state = {
      deprecatedLangsInUse: [],
      fieldToDelete: undefined,
      isDeleteConfirmationModalVisible: false,
      fields: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchFields();
  }

  fetchFields = async () => {
    const fields = await (this.props.indexPattern.getScriptedFields() as ScriptedFieldItem[]);

    const deprecatedLangsInUse = [];
    const deprecatedLangs = getDeprecatedScriptingLanguages();
    const supportedLangs = getSupportedScriptingLanguages();

    for (const field of fields) {
      const lang: string = field.lang;
      if (deprecatedLangs.includes(lang) || !supportedLangs.includes(lang)) {
        deprecatedLangsInUse.push(lang);
      }
    }

    this.setState({
      fields,
      deprecatedLangsInUse,
    });
  };

  getFilteredItems = () => {
    const { fields } = this.state;
    const { fieldFilter, scriptedFieldLanguageFilter } = this.props;

    let languageFilteredFields = fields;

    if (scriptedFieldLanguageFilter) {
      languageFilteredFields = fields.filter(
        (field) => field.lang === this.props.scriptedFieldLanguageFilter
      );
    }

    let filteredFields = languageFilteredFields;

    if (fieldFilter) {
      const normalizedFieldFilter = fieldFilter.toLowerCase();

      filteredFields = languageFilteredFields.filter((field) =>
        field.name.toLowerCase().includes(normalizedFieldFilter)
      );
    }

    return filteredFields;
  };

  startDeleteField = (field: ScriptedFieldItem) => {
    this.setState({ fieldToDelete: field, isDeleteConfirmationModalVisible: true });
  };

  hideDeleteConfirmationModal = () => {
    this.setState({ fieldToDelete: undefined, isDeleteConfirmationModalVisible: false });
  };

  deleteField = () => {
    const { indexPattern, onRemoveField, saveIndexPattern } = this.props;
    const { fieldToDelete } = this.state;

    indexPattern.removeScriptedField(fieldToDelete!.name);
    saveIndexPattern(indexPattern);

    if (onRemoveField) {
      onRemoveField();
    }

    this.fetchFields();
    this.hideDeleteConfirmationModal();
  };

  render() {
    const { indexPattern, painlessDocLink, useUpdatedUX } = this.props;
    const { fieldToDelete, deprecatedLangsInUse } = this.state;

    const items = this.getFilteredItems();

    return (
      <>
        <Header indexPatternId={indexPattern.id || ''} useUpdatedUX={useUpdatedUX} />

        <CallOuts deprecatedLangsInUse={deprecatedLangsInUse} painlessDocLink={painlessDocLink} />

        <EuiSpacer size="l" />

        <Table
          indexPattern={indexPattern}
          items={items}
          editField={(field) => this.props.helpers.redirectToRoute(field)}
          deleteField={this.startDeleteField}
        />

        {fieldToDelete && (
          <DeleteScritpedFieldConfirmationModal
            deleteField={this.deleteField}
            field={fieldToDelete}
            hideDeleteConfirmationModal={this.hideDeleteConfirmationModal}
          />
        )}
      </>
    );
  }
}
