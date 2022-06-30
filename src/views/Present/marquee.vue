<template>
    <div class="marquee" :id="idName">
        <ul>
            <slot></slot>
        </ul>    
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Marquee extends Vue {
    @Prop() readonly idName!:string;
    @Prop({ default: 1 }) readonly speed!:number;
    @Prop({ default: 'up' }) readonly direction!:string;

    private mounted(): void{
        this.$nextTick(() =>{
            this.marquee();
        });
    }

    private marquee(): void{
        try{
            document.execCommand("BackgroundImageCache", false, 'true');
        }catch(e){
            console.log(e);
        };
        
        const container:any = document.getElementById(this.idName);
        const original = container.firstChild;
        let clone:any = null;

        setTimeout(() =>{
            if(original.offsetHeight > container.offsetHeight){
                clone = original.cloneNode(true)
                container.appendChild(clone);

                const rolling = () =>{
                    if(this.direction === 'up'){
                        if(container.scrollTop === clone.offsetTop){
                            container.scrollTop = 0;
                        }else{
                            container.scrollTop++;
                        }
                    }else if(this.direction === 'down'){
                        if(container.scrollTop === 0){
                            container.scrollTop = clone.offsetTop;
                        }else{
                            container.scrollTop--;
                        }
                    }else if(this.direction === 'left'){
                        if(container.scrollLeft === clone.offsetLeft){
                            container.scrollLeft = 0;
                        }else{
                            container.scrollLeft++;
                        }
                    }else if(this.direction === 'right'){
                        if(container.scrollLeft === 0){
                            container.scrollLeft = clone.offsetLeft;
                        }else{
                            container.scrollLeft--;
                        }
                    }

                }

                let timer = setInterval(() =>{
                    rolling()
                }, this.speed*50)
                
                container.onmouseover = () => {
                    clearInterval(timer)
                    this.$emit('onmouseover');
                }
                container.onmouseout = () => {
                    timer = setInterval(() =>{rolling()}, this.speed*50)
                    this.$emit('onmouseout');
                }
            }
        }, 300);
    }      
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.marquee{
    position: relative;
    max-height: 100%;
    width: 100%;
    overflow:hidden;
    // >li{
    //     list-style: none;
    // }
}
</style>