<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:block="urn:bem:block"
    xmlns:elem="urn:bem:elem"
    xmlns:mod="urn:bem:mod"
    exclude-result-prefixes=" block elem mod "
    version="1.0">

    <xsl:template match="block:b-button">
        <span>
            <xsl:call-template name="block:class">
                <xsl:with-param name="js" select="true()" />
            </xsl:call-template>
            <xsl:apply-templates />
        </span>
    </xsl:template>

</xsl:stylesheet>
