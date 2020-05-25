<template>
    <div v-ripple :class="{ active }" @click="$emit('click', item)">
        <span>
            {{ item.content }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        active: Boolean,
    },
    filters: {
        pre: val => val.replace(/\n/g, '<br>')
    }
}
</script>

<style lang="scss" scoped>
div{
    display: table;
    box-sizing: border-box;
    width: 100%;
    height: 120px;
    padding: 10px 10px 10px 0;
    margin-bottom: -1px;
    border: 1px solid rgb(214, 214, 214);
    cursor: pointer;
    font-size: 8px;
    transition: background-color 0.5s, opacity 0.5s, border-color 0.5s;
    &:hover{
        background-color: rgb(208, 224, 255);
        opacity: 1;
    }
}
span{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    cursor: pointer !important;
    white-space: pre-wrap;
}
.active{
    border-color: rgb(192, 192, 192);
    background-color: rgb(231, 239, 255);
}
</style>