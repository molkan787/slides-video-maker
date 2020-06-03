<template>
    <div class="root">
        <h4>Place a mark at each position you want to make a separate slide.</h4>
        <textarea v-model="text" ref="textarea" class="editor" />
        <div class="footer">
            <v-btn elevation="0" dark @click="addMarkAtCurrentPosition">Add mark</v-btn>
            <v-btn elevation="0" dark @click="autoMarkEachLine">Auto Mark</v-btn>
        </div>
    </div>
</template>

<script>
const MARK_CHAR = '🔶';
export default {
    data:() => ({
        text: 'Some random text\nis here'
    }),
    methods: {
        addMarkAtCurrentPosition(){
            this.editText((val, pos) => ({
                newval: val.substr(0, pos) + MARK_CHAR + val.substr(pos),
                newpos: pos + MARK_CHAR.length
            }));
        },
        autoMarkEachLine(){
            this.editText((val, pos) => {
                const newval = val.replaceAll(MARK_CHAR, '').split('\n')
                .map(ln => ln.trim().length > 0 ? ln + MARK_CHAR : ln).join('\n');
                return {
                    newval,
                    newpos: pos,
                }
            });
        },

        editText(modifier){
            const ta = this.$refs.textarea;
            const pos = ta.selectionStart;
            const val = this.text;
            const { newval, newpos } = modifier(val, pos);
            this.text = newval;
            this.$nextTick().then(() => {
                ta.selectionStart = newpos;
                ta.selectionEnd = newpos;
                ta.focus();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.root{
    background-color: white;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 2px #444;
}
$headerHeight: 30px;
$footerHeight: 50px;
textarea{
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - #{$footerHeight + $headerHeight});
    padding: 6px;
    resize: none;
    background-color: white;
    color: rgb(59, 59, 59);
    font-weight: bold;
    outline: none;
    border: 2px solid #28a4d4;
    border-radius: 3px;
}
.footer{
    width: 100%;
    height: $footerHeight;
}
h4{
    height: $headerHeight;
    margin: 0;
    color: #808080;
    font-size: 15px;
}
</style>