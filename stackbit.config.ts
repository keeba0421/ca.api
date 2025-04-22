import {
  defineStackbitConfig,
  getLocalizedFieldForLocale,
  SiteMapEntry
} from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  contentSources: [
    // ...
  ],
  // 1: add the `pageId` field here
  modelExtensions: [
    {
      name: "page",
      type: "page",
      urlPath: "/{slug}",
      fields: [{ name: "pageId", type: "string", hidden: true }]
    }
  ],

  // 2: add this method to create the ID when creating a page
  async onContentCreate({ object, model }) {
    if (model.type !== "page") {
      return object;
    }
    // for pages that already have a pageId field, use that value; if not, generate one
    const hasPageIdField = !!model.fields?.find(
      field => field.name === "pageId"
    );
    if (hasPageIdField && !object.pageId) {
      object.pageId = Date.now().toString();
    }

    return object;
  },

  siteMap: ({ documents, models }) => {
    const pageModels = models.filter(m => m.type === "page").map(m => m.name);
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        // 3: use the pageId value for the stableId
        const slugField =
          document.fields.slug.type === "slug"
            ? document.fields.slug
            : undefined;
        const pageIdField =
          document.fields.pageId.type === "string"
            ? document.fields.pageId
            : undefined;

        const slug = getLocalizedFieldForLocale(slugField);
        const pageId = getLocalizedFieldForLocale(pageIdField);

        if (!slug.value || !pageId.value) return null;

        const urlPath = "/" + slug.value.replace(/^\/+/, "");

        return {
          stableId: pageId.value,
          urlPath,
          document,
          isHomePage: urlPath === "/"
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },

  // 4: devCommand 추가
  devCommand: "next dev" // 사용 중인 프레임워크에 맞는 명령어로 수정
});
