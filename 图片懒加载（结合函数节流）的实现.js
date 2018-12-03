/**
 * Created by lz on 2018/1/15.
 */
class DealImage{
    construct(url){
        const test = 10;
        this.image_url = url; //缓存待加载图片的地址
        this.minHeight = [0,0,0,0];//用于存放待比较的高度值
        this.num = 0;//存放加载的次数
        this.len = this.image_url.length;
    }
    /*函数节流（防止滚动条或resize事件触发过快）*/
    Throttle(fn){
        clearTimeout(fn.flag);
        fn.flag = setTimeout(function(){
            fn(myDealImage.num);
        },100);
    }
    updateNum(){
        this.num++;
    }
    loadImage(num){
       var img_array = this.image_url;
        for(var i = num*20;i < (this.len - i*20 <= 20?this.len:(num+1)*20);i++){
            /*以下载入图片*/
            var img_index = this[i],
                url = img_array[img_index],           
                min_height = Math.min(...this.minHeight),
                min_index = this.minHeight.indexOf(min_height);
            //事先定义好类
            var load_ele = $("ul:eq(min_index) .prepare_load:eq(0)")[0];
                load_ele.classList.remove("prepare_load");//加载后清除待加载标记
                load_ele.src = url;
            /*更新位置数组*/
            this.minHeight[min_index]+=load_ele.offsetHeight;
        }
        this.updateNum(); //更新num,为下次加载做准备
    }
    //初始加载
    initLoad = function(){
    this.loadImage(0);
    }
}
/*以下为具体实施方法*/
var myDealImage = new DealImage([]);
//页面初始化，先加载20张
myDealImage.initLoad();
//等待resize 或 scroll事件触发以更新图片
$(document).on("scroll resize",function(){
    //先判断是否满足加载条件（滚动条的高度位置+可见窗口大小超过了高度最低的图片）
    //var min_height = Math.min(...myDealImage.minHeight);
    var min_height = Math.min.apply(Math,myDealImage.minHeight);
    var documentEle = document.documentElement;
    if(documentEle.scrollTop+ documentEle.clientHeight >= min_height) {
        myDealImage.Throttle(myDealImage.loadImage(myDealImage.num));
    }
});
