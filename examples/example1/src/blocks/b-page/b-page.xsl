<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:block="urn:bem:block"
    xmlns:elem="urn:bem:elem"
    xmlns:mod="urn:bem:mod"
    exclude-result-prefixes=" block elem mod "
    version="1.0">

    <xsl:template match="block:b-page">
        <html>
            <xsl:call-template name="block:class">
                <xsl:with-param name="js" select="true()" />
            </xsl:call-template>
            <head>
                <title>Example 1 — jQuery BEM</title>
                <link type="text/css" href="example1.css" rel="stylesheet" />
                <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
                <script type="text/javascript" src="../../jquery-bem.js"></script>
                <script type="text/javascript" src="example1.js"></script>
            </head>
            <body class="b-page__body">
                <xsl:apply-templates select="elem:body/node()" />
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
