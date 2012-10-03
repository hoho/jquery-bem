<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:block="urn:bem:block"
    xmlns:elem="urn:bem:elem"
    xmlns:mod="urn:bem:mod"
    exclude-result-prefixes=" block elem mod "
    version="1.0">

    <xsl:output method="html" />


    <xsl:template match="@mod:*">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name(..)" />
        <xsl:text>_</xsl:text>
        <xsl:value-of select="local-name(.)" />
        <xsl:text>_</xsl:text>
        <xsl:value-of select="." />
    </xsl:template>


    <xsl:template match="elem:*/@mod:*">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name(ancestor::block:*[1])" />
        <xsl:text>__</xsl:text>
        <xsl:value-of select="local-name(..)" />
        <xsl:text>_</xsl:text>
        <xsl:value-of select="local-name(.)" />
        <xsl:text>_</xsl:text>
        <xsl:value-of select="." />
    </xsl:template>


    <xsl:template name="block:class">
        <xsl:param name="js" />
        <xsl:attribute name="class">
            <xsl:if test="$js">
                <xsl:text>js </xsl:text>
            </xsl:if>
            <xsl:value-of select="local-name(.)" />
            <xsl:apply-templates select="@mod:*" />
        </xsl:attribute>
    </xsl:template>


    <xsl:template name="elem:class">
        <xsl:attribute name="class">
            <xsl:value-of select="local-name(ancestor::block:*[1])" />
            <xsl:text>__</xsl:text>
            <xsl:value-of select="local-name(.)" />
            <xsl:apply-templates select="@mod:*" />
        </xsl:attribute>
    </xsl:template>

</xsl:stylesheet>
