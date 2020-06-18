<template>
  <section class="section">
    <b-steps v-model="activeStep" :has-navigation="false">
      <template v-for="(step, index) in steps">
        <b-step-item :key="index" :label="step.label" :clickable="true">
          {{ step.content }}
        </b-step-item>
      </template>
    </b-steps>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

<script>
export default {
  name: "Step",
  data() {
    return {
      activeStep: 0,
      steps: [
        {
          label: "Aircraft",
          content: "Pictures: Lorem ipsum dolor sit amet."
        },
        {
          label: "Trace a route",
          content: "Music: Lorem ipsum dolor sit amet."
        },
        {
          label: "Balance & Weight",
          content: "Videos: Lorem ipsum dolor sit amet."
        }
      ]
    };
  }
  // computed: {
  //   steps() {
  //     return [
  //       {
  //         label: "Aircraft",
  //         content: "Pictures: Lorem ipsum dolor sit amet.",
  //       },
  //       {
  //         label: "Trace a route",
  //         content: "Music: Lorem ipsum dolor sit amet.",
  //       },
  //       {
  //         label: "Balance & Weight",
  //         content: "Videos: Lorem ipsum dolor sit amet.",
  //       },
  //     ];
  //   },
  // },
};
</script>
