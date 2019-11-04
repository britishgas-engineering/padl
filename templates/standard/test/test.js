suite('DASH_NAME', function() {

  test('instantiating the element with default properties works', async () => {
    const element = await fixture('COMPONENT_NAMEBasicTestFixture');
    const elementShadowRoot = element.shadowRoot;
    const elementHeader = elementShadowRoot.querySelector('h2');

    assert.equal(element.prop1, 'DASH_NAME', 'prop1 has value `DASH_NAME`');
    assert.equal(elementHeader.innerHTML, 'Hello DASH_NAME!', 'header has correct value');
    a11ySuite('COMPONENT_NAMEBasicTestFixture');
  });

  test('setting a property on the element works', async () => {
    const element = await fixture('COMPONENT_NAMEChangedPropertyTestFixture');
    const elementShadowRoot = element.shadowRoot;
    const elementHeader = elementShadowRoot.querySelector('h2');

    assert.equal(element.prop1, 'new-prop1', 'prop1 has value `new-prop1`');
    assert.equal(elementHeader.innerHTML, 'Hello new-prop1!', 'header has correct value');
    a11ySuite('COMPONENT_NAMEChangedPropertyTestFixture');
  });

});
