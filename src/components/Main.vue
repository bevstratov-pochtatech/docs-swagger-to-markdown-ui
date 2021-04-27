<template>
  <div>
    <h1>Конвертация Swagger в Markdown</h1>
    <h3>Вставьте json или yaml Swagger-описания API:</h3>
    <textarea id="yaml" rows="16" cols="100" v-model="inputYaml"> </textarea>
    <br />
    <button v-on:click="handleSubmit">Конвертировать</button>
    <h3>Markdown:</h3>
    <textarea
      id="markdown"
      rows="24"
      cols="100"
      v-model="outputMarkdown"
      readonly
    >
    </textarea>
  </div>
</template>

<script>
const yaml = require("js-yaml");
const { transformSwagger } = require("../swagger-markdown/converter/convert");
export default {
  name: "HelloWorld",
  data: function () {
    return {
      inputYaml: "",
      outputMarkdown:
        "Нажмите кнопку «Конвертировать», сгенерированный Markdown будет отображён в этом поле",
    };
  },
  methods: {
    handleSubmit: function () {
      try {
        const inputDoc = yaml.safeLoad(this.inputYaml);
        const document = transformSwagger(inputDoc);
        
        this.outputMarkdown = document;
      } catch (e) {
        this.outputMarkdown = e;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
