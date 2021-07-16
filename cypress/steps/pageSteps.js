import { PAGES_LIST } from "../elements/pages/pages-list";
import { PAGE_DETAILS } from "../elements/pages/pege-details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { urlList } from "../url/urlList";
import { confirmationMessageShouldDisappear } from "./shared/confirmationMessage";
import { fillAutocompleteSelect } from "./shared/selects";

export const attributesTypes = {
  DROPDOWN: addSelectAttributeValue,
  MULTISELECT: addSelectAttributeValue,
  // Uncomment it after resolving SALEOR-3728 bug
  // RICH_TEXT: addRichTextAttributeValue,
  BOOLEAN: addBooleanAttributeValue,
  NUMERIC: addNumericAttributeValue
};
export function createPage({
  pageName,
  pageTypeName,
  isPublished = false,
  attributeType = "DROPDOWN",
  attributeValue
}) {
  openCreatePageAndFillUpGeneralFields({ pageName, pageTypeName, isPublished });
  attributesTypes[attributeType](attributeValue);
  return savePage();
}

export function addSelectAttributeValue(attributeValue) {
  fillAutocompleteSelect(PAGE_DETAILS.attributeValues, attributeValue);
}

export function addRichTextAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS.attributeValues)
    .find(SHARED_ELEMENTS.richTextEditor.empty)
    .should("exist")
    .get(PAGE_DETAILS.attributeValues)
    .find(PAGE_DETAILS.richTextEditorAttributeValue)
    .type(attributeValue);
}

export function addBooleanAttributeValue() {
  cy.get(PAGE_DETAILS.booleanAttributeValueCheckbox).click();
}

export function addNumericAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS.numericAttributeValueInput).type(attributeValue);
}

function openCreatePageAndFillUpGeneralFields({
  pageName,
  pageTypeName,
  isPublished
}) {
  cy.visit(urlList.pages)
    .get(PAGES_LIST.createPageButton)
    .click()
    .get(PAGE_DETAILS.nameInput)
    .type(pageName);
  if (isPublished) {
    cy.get(PAGE_DETAILS.isPublishedCheckbox).click();
  }
  fillAutocompleteSelect(
    PAGE_DETAILS.pageTypesAutocompleteSelect,
    pageTypeName
  );
}

function savePage() {
  cy.addAliasToGraphRequest("PageCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click();
  confirmationMessageShouldDisappear();
  return cy.wait("@PageCreate").its("response.body.data.pageCreate.page");
}
