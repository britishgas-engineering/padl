suite('foo-bar', function() {

  test('instantiating the element with default properties works', async () => {
    const element = await fixture('fooBarBasicTestFixture');
    const elementShadowRoot = element.shadowRoot;
    const elementHeader = elementShadowRoot.querySelector('h2');

    assert.equal(element.prop1, 'foo-bar', 'prop1 has value `foo-bar`');
    assert.equal(elementHeader.innerHTML, 'Hello foo-bar!', 'header has correct value');
    a11ySuite('fooBarBasicTestFixture');
  });

  test('setting a property on the element works', async () => {
    const element = await fixture('fooBarChangedPropertyTestFixture');
    const elementShadowRoot = element.shadowRoot;
    const elementHeader = elementShadowRoot.querySelector('h2');

    assert.equal(element.prop1, 'new-prop1', 'prop1 has value `new-prop1`');
    assert.equal(elementHeader.innerHTML, 'Hello new-prop1!', 'header has correct value');
    a11ySuite('fooBarChangedPropertyTestFixture');
  });

});
