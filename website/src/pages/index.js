import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Readable code</>,
    // imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        tidy.js prioritizes making your data transformations readable, so future
        you and your teammates can get up and running quickly.
      </>
    ),
  },
  {
    title: <>Standard transformation verbs</>,
    // imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Inspired by <Link href="https://dplyr.tidyverse.org/">dplyr</Link> and
        the <Link href="https://www.tidyverse.org/">tidyverse</Link> in R,{' '}
        tidy.js is built using battle-tested verbs that can handle any data
        wrangling need.
      </>
    ),
  },
  {
    title: <>Work with plain JS objects</>,
    // imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        No wrapper classes needed — all tidy.js needs is an array of plain
        old-fashioned JS objects to get started.
      </>
    ),
  },
];

const functions = [
  {
    heading: 'Tidy Functions',
    url: 'docs/api/tidy',
    items: [
      'addItems / addRows',
      'arrange / sort',
      'complete',
      'count',
      'debug',
      'distinct',
      'expand',
      'fill',
      'filter',
      'fullJoin',
      'groupBy',
      'innerJoin',
      'leftJoin',
      'map',
      'mutate',
      'mutateWithSummary',
      'rename',
      'replaceNully',
      'select / pick',
      'slice',
      'sliceHead',
      'sliceTail',
      'sliceMin',
      'sliceMax',
      'sliceSample',
      'summarize',
      'summarizeAll',
      'summarizeAt',
      'summarizeIf',
      'tally',
      'total',
      'totalAll',
      'totalAt',
      'totalIf',
      'transmute',
      'when',
    ],
  },
  {
    heading: 'Grouping with groupBy',
    url: 'docs/api/groupby',
    items: [
      'groupBy',
      'groupBy.grouped',
      'groupBy.entries',
      'groupBy.entriesObject',
      'groupBy.object',
      'groupBy.map',
      'groupBy.keys',
      'groupBy.values',
      'groupBy.levels',
    ],
  },
  {
    heading: 'Summarizers',
    url: 'docs/api/summary',
    items: [
      'deviation',
      'first',
      'last',
      'max',
      'mean',
      'meanRate',
      'median',
      'min',
      'n',
      'nDistinct',
      'sum',
      'variance',
    ],
  },
  {
    heading: 'Item Functions',
    url: 'docs/api/item',
    items: ['rate'],
  },
  {
    heading: 'Vector Functions',
    url: 'docs/api/vector',
    items: ['cumsum', 'lag', 'lead', 'roll', 'rowNumber'],
  },
  {
    heading: 'Pivot',
    url: 'docs/api/pivot',
    items: ['pivotLonger', 'pivotWider'],
  },

  {
    heading: 'Sequences',
    url: 'docs/api/sequences',
    items: ['fullSeq', 'fullSeqDate', 'fullSeqDateISOString'],
  },
  {
    heading: 'Selectors',
    url: 'docs/api/selectors',
    items: [
      'contains',
      'endsWith',
      'everything',
      'matches',
      'negate',
      'numRange',
      'startsWith',
    ],
  },

  {
    heading: 'TMath',
    url: 'docs/api/math',
    items: ['add', 'rate', 'subtract'],
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout description="Tidy up your data with JavaScript, inspired by dplyr and the tidyverse from R.">
      <header className={clsx('hero hero--tidy', styles.heroBanner)}>
        <div className="container">
          <img
            src={useBaseUrl('img/logo.svg')}
            alt="Tidy.js Logo"
            width={256}
          />
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--lg button--primary ',
                styles.getStarted
              )}
              to={useBaseUrl('docs/getting_started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className={styles.funcs}>
          <div className="container">
            <h3>Function List</h3>
            <p>
              Here's a quick jumping off point to see the API for all the
              functions provided by tidy.js.
            </p>
            {functions.map((funcSet, i) => {
              return (
                <div key={i} className={styles.funcSet}>
                  <h4 className={styles.funcSetHeading}>{funcSet.heading}</h4>
                  <div className={styles.funcSetItems}>
                    {funcSet.items.map((fn) => {
                      const slug = `${funcSet.url}#${fn
                        .toLowerCase()
                        .replace(/\//g, '')
                        .replace(/\./g, '')
                        .replace(/ /g, '-')}`;
                      return (
                        <Link key={fn} to={slug} className={styles.funcSetItem}>
                          {fn}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
