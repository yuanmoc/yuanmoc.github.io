---
title: Tools
type: docs
---

# 工具

<div class="tools-container">
    <div class="data" onclick="window.open('./拼音/', '_self');">
        <div>
            <image src="/favicon.png">
                <span class="name">拼音</span>
        </div>
        <span class="description"></span>
    </div>
</div>


<style>
    .tools-container {
        display: inline-block;
    }

    .tools-container .data {
        width: 300px;
        height: 100px;
        margin: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        box-shadow: 2px 2px 5px #ccc;
        float: left;
        position: relative;
        cursor: pointer;
    }

    .tools-container .data::before {
        content: "";
        position: absolute;
        width: 50%;
        height: 50%;
        background-color: rgba(240, 240, 240, 0.5);
        transform: rotate(-24deg) translate(35%, 94%);
    }

    .tools-container .data img {
        width: 28px;
        border-radius: 999px;
        margin-right: 10px;
        float: left;
    }

    .tools-container .data .description {
        display: block;
        font-size: 12px;
        height: 66px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>