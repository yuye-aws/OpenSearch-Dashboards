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

import React from 'react';
import PropTypes from 'prop-types';
import { EuiSmallButton, EuiContextMenu, EuiIcon, EuiPopover } from '@elastic/eui';

import { i18n } from '@osd/i18n';
import { getServices } from '../opensearch_dashboards_services';
import { createAppNavigationHandler } from './app_navigation_handler';

export class SampleDataViewDataButton extends React.Component {
  addBasePath = getServices().addBasePath;
  isDataSourceEnabled = !!getServices().dataSource;
  chrome = getServices().chrome;

  state = {
    isPopoverOpen: false,
  };

  togglePopoverVisibility = () => {
    this.setState((prevState) => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }));
  };

  closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };

  render() {
    const viewDataButtonLabel = i18n.translate('home.sampleDataSetCard.viewDataButtonLabel', {
      defaultMessage: 'View data',
    });
    const viewDataButtonAriaLabel = i18n.translate(
      'home.sampleDataSetCard.viewDataButtonAriaLabel',
      {
        defaultMessage: 'View {datasetName}',
        values: {
          datasetName: this.props.name,
        },
      }
    );
    const dashboardPath = `/app/dashboards#/view/${this.props.overviewDashboard}`;
    const prefixedDashboardPath = this.addBasePath(dashboardPath);

    if (this.props.appLinks.length === 0 && this.props.overviewDashboard !== '') {
      return (
        <EuiSmallButton
          onClick={createAppNavigationHandler(dashboardPath)}
          data-test-subj={`launchSampleDataSet${this.props.id}`}
          aria-label={viewDataButtonAriaLabel}
        >
          {viewDataButtonLabel}
        </EuiSmallButton>
      );
    }

    const additionalItems = this.props.appLinks.map(
      ({ path, label, icon, newPath, appendDatasourceToPath }) => {
        // switch paths if new nav is enabled
        let appPath = this.chrome.navGroup.getNavGroupEnabled()
          ? this.addBasePath(newPath)
          : this.addBasePath(path);
        // append datasourceId to app path
        if (this.isDataSourceEnabled && appendDatasourceToPath) {
          appPath = `${appPath}?datasourceId=${this.props.dataSourceId}`;
        }
        return {
          name: label,
          icon: <EuiIcon type={icon} size="m" />,
          href: appPath,
          onClick: createAppNavigationHandler(appPath),
        };
      }
    );
    const panels = [
      {
        id: 0,
        items: [
          ...(this.props.overviewDashboard !== ''
            ? [
                {
                  name: i18n.translate('home.sampleDataSetCard.dashboardLinkLabel', {
                    defaultMessage: 'Dashboard',
                  }),
                  icon: <EuiIcon type="dashboardApp" size="m" />,
                  href: prefixedDashboardPath,
                  onClick: createAppNavigationHandler(dashboardPath),
                },
              ]
            : []),
          ...additionalItems,
        ],
      },
    ];
    const popoverButton = (
      <EuiSmallButton
        aria-label={viewDataButtonAriaLabel}
        onClick={this.togglePopoverVisibility}
        iconType="arrowDown"
        iconSide="right"
      >
        {viewDataButtonLabel}
      </EuiSmallButton>
    );
    return (
      <EuiPopover
        id={`sampleDataLinks${this.props.id}`}
        button={popoverButton}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        panelPaddingSize="none"
        anchorPosition="downCenter"
        data-test-subj={`launchSampleDataSet${this.props.id}`}
      >
        <EuiContextMenu initialPanelId={0} panels={panels} size="s" />
      </EuiPopover>
    );
  }
}

SampleDataViewDataButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  overviewDashboard: PropTypes.string.isRequired,
  appLinks: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};
