function getFetchDataFunctions(component) {
  return component.WrappedComponent
    ? getFetchDataFunctions(component.WrappedComponent)
    : component.fetchData;
}

export default function getDataDependencies(components, { dispatch, params, query }) {
  return components
    .filter(component => getFetchDataFunctions(component))
    .map(component => getFetchDataFunctions(component))
    .map(fetchDataFunction => fetchDataFunction({ dispatch, params, query }));
}
